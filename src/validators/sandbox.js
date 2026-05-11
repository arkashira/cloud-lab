// This file needs to be created based on the task requirements

const Joi = require('joi');

/**
 * Validation schema for sandbox creation
 * Based on PRD 20260509-125453-reddit-04583765dfe34f47
 * 
 * Requirements:
 * - POST /api/sandboxes creates a sandbox with uuid, name, description, created_at
 * - Sandbox defaults to 'active' status on creation
 * - Response includes sandbox ID for subsequent operations
 * - Created sandbox appears in list immediately
 */
const createSandboxSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Sandbox name is required',
      'string.max': 'Sandbox name must not exceed 255 characters',
      'any.required': 'Sandbox name is required'
    }),
  
  description: Joi.string()
    .max(1000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    })
});

/**
 * Validation schema for sandbox update
 */
const updateSandboxSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(255)
    .optional()
    .messages({
      'string.max': 'Sandbox name must not exceed 255 characters'
    }),
  
  description: Joi.string()
    .max(1000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    }),
  
  status: Joi.string()
    .valid('active', 'inactive', 'archived')
    .optional()
    .messages({
      'any.only': 'Status must be one of: active, inactive, archived'
    })
}).min(1);

/**
 * Validation schema for sandbox ID parameter
 */
const sandboxIdSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Invalid sandbox ID format',
      'any.required': 'Sandbox ID is required'
    })
});

/**
 * Validation schema for listing sandboxes (query params)
 */
const listSandboxesSchema = Joi.object({
  status: Joi.string()
    .valid('active', 'inactive', 'archived')
    .optional(),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20),
  
  offset: Joi.number()
    .integer()
    .min(0)
    .default(0)
});

module.exports = {
  createSandboxSchema,
  updateSandboxSchema,
  sandboxIdSchema,
  listSandboxesSchema
};