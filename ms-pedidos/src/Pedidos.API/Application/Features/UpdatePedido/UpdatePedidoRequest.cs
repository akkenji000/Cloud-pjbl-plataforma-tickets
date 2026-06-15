namespace Pedidos.API.Application.Features.UpdatePedido;

public record UpdatePedidoRequest(
    string EventoId, string ClienteNome, string ClienteEmail,
    int Quantidade, decimal ValorTotal, string Status);
