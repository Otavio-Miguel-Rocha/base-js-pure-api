const http = require("http");
const url = require("url");
const { getAll, getOne, comment, rate } = require("./service/cellphoneService.js");
const { login } = require("./service/authService.js");


const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500")
    res.setHeader("Access-Control-Allow-Method", "POST")
    res.setHeader("Access-Control-Expose-Headers", "Content-Type, Authorization")
    const urlParsed = url.parse(req.url, true);
    const pathname = urlParsed.pathname;

    let body = "";
    req.on("data", (chunk) => {
        console.log(chunk.toString());
        body += chunk.toString();
    })
    req.on("end", async () => {
        try {
            if (pathname.includes("/api/celular")) {
                let idRoute;
                try {
                    idRoute = urlParsed.pathname.match(/^\/api\/celular\/(\d+)$/)[1];
                } catch (error) {
                    try {
                        if (pathname.includes("avaliacao")) {
                            idRoute = urlParsed.pathname.match(/^\/api\/celular\/(\d+)\/avaliacao$/)[1];
                        } else if (pathname.includes("comentario")) {
                            idRoute = urlParsed.pathname.match(/^\/api\/celular\/(\d+)\/comentario$/)[1];
                        }
                    } catch (error2) { }
                }
                if (!idRoute) {
                    //GET ALL
                    response(res, await getAll(), 200)
                } else {
                    if (req.method == "GET") {
                        //GET ONE
                        response(res, await getOne(idRoute), 200)
                    } else if (pathname.includes("avaliacao")) {
                        //AVALIAÇÃO
                        response(res, await rate(JSON.parse(body), idRoute), 200);
                    } else if (pathname.includes("comentario")) {
                        //COMENTÁRIO
                        const comentario = JSON.parse(body)
                        try {
                            await comment(comentario, idRoute);
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end();
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }

            } else if (pathname.includes("/api/login")) {
                response(res, await login(JSON.parse(body), 200));
            } else {

            }
        } catch (error) {
            res.writeHead(400, error);
        }
    });

});

async function response(res, result, code) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
}

server.listen(3000, () => {
    console.log("Server iniciado!");
});
