namespace Pedidos.API.Application.Features.CreatePedido;

public record CreatePedidoResponse(
    int Id, string EventoId, string ClienteNome, string ClienteEmail,
    int Quantidade, decimal ValorTotal, string Status, DateTime DataPedido);
