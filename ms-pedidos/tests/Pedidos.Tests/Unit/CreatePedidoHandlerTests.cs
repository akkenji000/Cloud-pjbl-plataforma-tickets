using Moq;
using Pedidos.API.Application.Features.CreatePedido;
using Pedidos.API.Domain.Entities;
using Pedidos.API.Domain.Interfaces;

namespace Pedidos.Tests.Unit;

public class CreatePedidoHandlerTests
{
    [Fact]
    public async Task Handle_ValidRequest_ReturnsCreatedPedido()
    {
        var mockRepo = new Mock<IPedidoRepository>();
        var request = new CreatePedidoRequest("ev-001", "João Silva", "joao@email.com", 2, 900.00m);

        mockRepo.Setup(r => r.CreateAsync(It.IsAny<Pedido>()))
            .ReturnsAsync(new Pedido
            {
                Id = 1, EventoId = request.EventoId, ClienteNome = request.ClienteNome,
                ClienteEmail = request.ClienteEmail, Quantidade = request.Quantidade,
                ValorTotal = request.ValorTotal, Status = "Pendente", DataPedido = DateTime.UtcNow
            });

        var handler = new CreatePedidoHandler(mockRepo.Object);
        var result = await handler.HandleAsync(request);

        Assert.NotNull(result);
        Assert.Equal("Pendente", result.Status);
        Assert.Equal(request.ClienteNome, result.ClienteNome);
        mockRepo.Verify(r => r.CreateAsync(It.IsAny<Pedido>()), Times.Once);
    }
}
