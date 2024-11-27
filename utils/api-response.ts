export function successResponse(data: any, msg = "success") {
  const jsonData = {
    success: true,
    data,
    message: msg,
  };
  return Response.json(jsonData);
}

export function errorResponse(msg = "error") {
  const jsonData = {
    success: false,
    message: msg,
  };
  return Response.json(jsonData);
}
