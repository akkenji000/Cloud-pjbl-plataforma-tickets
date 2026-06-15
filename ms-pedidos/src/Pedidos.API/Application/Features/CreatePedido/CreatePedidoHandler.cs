using Pedidos.API.Domain.Entities;
using Pedidos.API.Domain.Interfaces;

namespace Pedidos.API.Application.Features.CreatePedido;

public class CreatePedidoHandler(IPedidoRepository repository)
{
    public async Task<CreatePedidoResponse> HandleAsync(CreatePedidoRequest request)
    {
        var pedido = new Pedido
        {
            EventoId = request.EventoId, ClienteNome = request.ClienteNome,
            ClienteEmail = request.ClienteEmail, Quantidade = request.Quantidade,
            ValorTotal = request.ValorTotal, Status = "Pendente", DataPedido = DateTime.UtcNow
        };
        var created = await repository.CreateAsync(pedido);
        return new CreatePedidoResponse(created.Id, created.EventoId, created.ClienteNome,
            created.ClienteEmail, created.Quantidade, created.ValorTotal,
            created.Status, created.DataPedido);
    }
}
