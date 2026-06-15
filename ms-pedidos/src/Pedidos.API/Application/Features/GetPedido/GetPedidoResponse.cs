namespace Pedidos.API.Application.Features.GetPedido;

public record GetPedidoResponse(
    int Id, string EventoId, string ClienteNome, string ClienteEmail,
    int Quantidade, decimal ValorTotal, string Status, DateTime DataPedido);
