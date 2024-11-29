export function successResponse(data: any, msg = "success") {
  const jsonData = {
    success: true,
    data,
    message: msg,
    code: 200,
  };
  return Response.json(jsonData);
}

export function errorResponse(msg = "error", code = 500) {
  const jsonData = {
    success: false,
    message: msg,
    code,
  };
  return Response.json(jsonData);
}
