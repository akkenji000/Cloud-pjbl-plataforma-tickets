using CatalogoEventos.API.Domain.Entities;
using CatalogoEventos.API.Domain.Interfaces;

namespace CatalogoEventos.API.Application.Features.CreateEvento;

public class CreateEventoHandler(IEventoRepository repository)
{
    public async Task<CreateEventoResponse> HandleAsync(CreateEventoRequest request)
    {
        var evento = new Evento
        {
            Nome = request.Nome, Data = request.Data, Local = request.Local,
            Capacidade = request.Capacidade, PrecoBase = request.PrecoBase,
            Categoria = request.Categoria, Status = "Ativo"
        };
        var created = await repository.CreateAsync(evento);
        return new CreateEventoResponse(created.Id!, created.Nome, created.Data,
            created.Local, created.Capacidade, created.PrecoBase, created.Categoria, created.Status);
    }
}
