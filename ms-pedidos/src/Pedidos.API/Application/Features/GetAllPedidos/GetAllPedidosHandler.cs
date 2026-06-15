using Pedidos.API.Application.Features.GetPedido;
using Pedidos.API.Domain.Interfaces;

namespace Pedidos.API.Application.Features.GetAllPedidos;

public class GetAllPedidosHandler(IPedidoRepository repository)
{
    public async Task<List<GetPedidoResponse>> HandleAsync()
    {
        var pedidos = await repository.GetAllAsync();
        return pedidos.Select(p => new GetPedidoResponse(p.Id, p.EventoId, p.ClienteNome,
            p.ClienteEmail, p.Quantidade, p.ValorTotal, p.Status, p.DataPedido)).ToList();
    }
}
