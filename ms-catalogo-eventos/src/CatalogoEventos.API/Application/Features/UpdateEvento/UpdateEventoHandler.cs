using CatalogoEventos.API.Domain.Interfaces;

namespace CatalogoEventos.API.Application.Features.UpdateEvento;

public class UpdateEventoHandler(IEventoRepository repository)
{
    public async Task HandleAsync(string id, UpdateEventoRequest request)
    {
        var existing = await repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Evento {id} não encontrado");
        existing.Nome = request.Nome; existing.Data = request.Data;
        existing.Local = request.Local; existing.Capacidade = request.Capacidade;
        existing.PrecoBase = request.PrecoBase; existing.Categoria = request.Categoria;
        existing.Status = request.Status;
        await repository.UpdateAsync(id, existing);
    }
}
