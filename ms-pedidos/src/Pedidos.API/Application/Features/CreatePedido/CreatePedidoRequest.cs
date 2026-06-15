namespace Pedidos.API.Application.Features.CreatePedido;

public record CreatePedidoRequest(
    string EventoId, string ClienteNome, string ClienteEmail,
    int Quantidade, decimal ValorTotal);
