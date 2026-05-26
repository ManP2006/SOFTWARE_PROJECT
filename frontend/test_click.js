import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const pageErrors = [];
  const consoleErrors = [];

  // Capture every console message
  page.on('console', msg => {
    const text = msg.text();
    console.log(`[PAGE ${msg.type().toUpperCase()}]: ${text}`);
    if (msg.type() === 'error') consoleErrors.push(text);
  });

  // Capture uncaught JS errors
  page.on('pageerror', err => {
    console.error('[PAGEERROR]:', err.toString());
    pageErrors.push(err.toString());
  });

  // Capture failed requests
  page.on('requestfailed', req => {
    console.error('[REQUEST FAILED]:', req.url(), req.failure()?.errorText);
  });

  console.log('\n=== Navigating to http://localhost:3000/ ===\n');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 15000 });

  console.log('Page title:', await page.title());

  // Wait a bit for all scripts to execute
  await new Promise(r => setTimeout(r, 2000));

  // === Diagnostic: check key globals and DOM state ===
  const diagnostics = await page.evaluate(() => {
    const modal = document.getElementById('role-modal');
    const trialBtn = Array.from(document.querySelectorAll('a.open-modal'))
      .find(b => b.textContent.trim() === 'Start Free Trial');

    return {
      windowGetElDefined: typeof window.getEl === 'function',
      initAppDefined: typeof window.initApp === 'function',
      roleModalExists: !!modal,
      roleModalHidden: modal ? modal.classList.contains('hidden') : null,
      roleModalClasses: modal ? modal.className : null,
      trialBtnExists: !!trialBtn,
      trialBtnText: trialBtn ? trialBtn.textContent.trim() : null,
    };
  });

  console.log('\n=== DIAGNOSTICS (before click) ===');
  Object.entries(diagnostics).forEach(([k, v]) => console.log(`  ${k}: ${JSON.stringify(v)}`));

  // === Try manually removing hidden class to test CSS ===
  await page.evaluate(() => {
    const modal = document.getElementById('role-modal');
    if (modal) modal.classList.remove('hidden');
  });
  await new Promise(r => setTimeout(r, 500));
  const manualVisible = await page.evaluate(() => {
    const modal = document.getElementById('role-modal');
    const styles = window.getComputedStyle(modal);
    return {
      hidden: modal.classList.contains('hidden'),
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      zIndex: styles.zIndex,
    };
  });
  console.log('\n=== Modal styles AFTER manual classList.remove("hidden") ===');
  console.log(JSON.stringify(manualVisible, null, 2));

  // Put it back hidden
  await page.evaluate(() => {
    const modal = document.getElementById('role-modal');
    if (modal) modal.classList.add('hidden');
  });

  // === Click the actual button ===
  console.log('\n=== Clicking Start Free Trial button ===');
  const clickResult = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.open-modal'));
    const trialBtn = btns.find(b => b.textContent.trim() === 'Start Free Trial');
    if (!trialBtn) return { error: 'Button not found' };
    
    let eventFired = false;
    const handler = (e) => { eventFired = true; };
    document.addEventListener('click', handler, { once: true });
    trialBtn.click();
    document.removeEventListener('click', handler);
    
    const modal = document.getElementById('role-modal');
    return {
      eventFired,
      modalHiddenAfterClick: modal ? modal.classList.contains('hidden') : null,
    };
  });
  console.log('Click result:', JSON.stringify(clickResult, null, 2));

  await new Promise(r => setTimeout(r, 1000));

  const afterClickState = await page.evaluate(() => {
    const modal = document.getElementById('role-modal');
    return {
      hidden: modal ? modal.classList.contains('hidden') : null,
      display: modal ? window.getComputedStyle(modal).display : null,
    };
  });
  console.log('Modal state after click:', JSON.stringify(afterClickState, null, 2));

  console.log('\n=== SUMMARY ===');
  console.log('Page errors:', pageErrors.length ? pageErrors : 'NONE');
  console.log('Console errors:', consoleErrors.length ? consoleErrors : 'NONE');

  await browser.close();
})();
