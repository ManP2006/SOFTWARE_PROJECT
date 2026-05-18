/**
 * PPS Payroll — Settings Controller
 */
import { Settings } from '../models/index.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    ApiResponse.ok('Settings fetched', settings).send(res);
});

export const updateSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();
    if (!settings) { settings = await Settings.create(req.body); }
    else { Object.assign(settings, req.body); await settings.save(); }
    ApiResponse.ok('Settings updated', settings).send(res);
});
