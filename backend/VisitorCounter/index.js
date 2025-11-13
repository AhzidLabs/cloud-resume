let visitCount = 0;

module.exports = async function (context, req) {
  visitCount++;

  context.res = {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: {
      count: visitCount
    }
  };
};
