using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Globalization;
using System.Net;

namespace TaxasFunction;

public class CalcularTaxaFunction
{
    [Function("CalcularTaxa")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "calcular-taxa")] HttpRequestData req)
    {
        var precoStr = req.Query["preco"];
        var userId = req.Query["userId"] ?? "default";

        decimal preco = decimal.TryParse(precoStr,
            NumberStyles.Any, CultureInfo.InvariantCulture, out var p) ? p : 0;

        var percentual = userId.Contains("vip") ? 5.0m : 10.5m;
        var valorTaxa = preco * (percentual / 100);
        var mensagem = userId.Contains("vip")
            ? "Você possui desconto VIP aplicável."
            : "Taxa de conveniência padrão aplicada.";

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(new
        {
            percentualAplicado = percentual,
            valorTaxa,
            mensagem,
            origem = "Azure Function"
        });

        return response;
    }
}
