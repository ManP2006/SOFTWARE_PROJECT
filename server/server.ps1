$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Prefixes.Add("http://127.0.0.1:8080/")
$listener.Start()
Write-Host "Server running at http://localhost:8080/"
Write-Host "Listening on localhost and 127.0.0.1"

$root = Split-Path -Parent $PSScriptRoot
$mimeTypes = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".json" = "application/json"
    ".webp" = "image/webp"
    ".jsx"  = "text/plain"
    ".txt"  = "text/plain"
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $localPath = $request.Url.LocalPath
    Write-Host "Request: $($request.HttpMethod) $localPath"
    
    if ($localPath -eq "/") { $localPath = "/public/index.html" }
    
    # Normalize path and handle directory traversal safely
    $path = $localPath.TrimStart("/").Replace("/", "\")
    $filePath = [System.IO.Path]::GetFullPath((Join-Path $root $path))

    # Security check: Ensure the path is within the root
    if (-not $filePath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
        Write-Host "Blocked potential directory traversal: $filePath"
        $response.StatusCode = 403
        $msg = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
        $response.OutputStream.Write($msg, 0, $msg.Length)
    } elseif (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
        $response.ContentType = $contentType
        
        try {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {
            Write-Host "Error serving file: $_"
            $response.StatusCode = 500
        }
    } else {
        Write-Host "404 Not Found: $filePath"
        $response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $response.OutputStream.Close()
}
