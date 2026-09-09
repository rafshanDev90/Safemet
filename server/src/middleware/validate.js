function formatZodErrors(error) {
  const formatted = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    const key = path || '_root';
    if (!formatted[key]) formatted[key] = [];
    formatted[key].push(issue.message);
  }
  return formatted;
}

export function validate(schemas) {
  return (req, res, next) => {
    const errors = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        Object.assign(errors, formatZodErrors(result.error));
      } else {
        req.validatedBody = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        Object.assign(errors, formatZodErrors(result.error));
      } else {
        req.validatedQuery = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        Object.assign(errors, formatZodErrors(result.error));
      } else {
        req.validatedParams = result.data;
      }
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    next();
  };
}