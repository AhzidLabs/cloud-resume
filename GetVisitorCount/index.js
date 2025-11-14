module.exports = async function (context, req) {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  try {
    context.res = { status: 200, headers, body: { ok: true, message: "hello from function", time: new Date().toISOString() } };
  } catch (e) {
    context.res = { status: 500, headers, body: { ok: false, message: e?.message } };
  }
};
