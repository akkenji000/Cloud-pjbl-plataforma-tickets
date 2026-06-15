using Moq;
using CatalogoEventos.API.Application.Features.CreateEvento;
using CatalogoEventos.API.Domain.Entities;
using CatalogoEventos.API.Domain.Interfaces;

namespace CatalogoEventos.Tests.Unit;

public class CreateEventoHandlerTests
{
    [Fact]
    public async Task Handle_ValidRequest_ReturnsCreatedEvento()
    {
        var mockRepo = new Mock<IEventoRepository>();
        var request = new CreateEventoRequest(
            "Rock in Rio", DateTime.Now.AddMonths(3),
            "Rio de Janeiro", 100000, 450.00m, "show");

        mockRepo.Setup(r => r.CreateAsync(It.IsAny<Evento>()))
            .ReturnsAsync(new Evento
            {
                Id = "507f1f77bcf86cd799439011",
                Nome = request.Nome, Data = request.Data, Local = request.Local,
                Capacidade = request.Capacidade, PrecoBase = request.PrecoBase,
                Categoria = request.Categoria, Status = "Ativo"
            });

        var handler = new CreateEventoHandler(mockRepo.Object);
        var result = await handler.HandleAsync(request);

        Assert.NotNull(result);
        Assert.Equal(request.Nome, result.Nome);
        Assert.Equal("Ativo", result.Status);
        mockRepo.Verify(r => r.CreateAsync(It.IsAny<Evento>()), Times.Once);
    }
}
