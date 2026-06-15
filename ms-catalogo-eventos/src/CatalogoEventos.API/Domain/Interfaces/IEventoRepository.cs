using CatalogoEventos.API.Domain.Entities;

namespace CatalogoEventos.API.Domain.Interfaces;

public interface IEventoRepository
{
    Task<List<Evento>> GetAllAsync();
    Task<Evento?> GetByIdAsync(string id);
    Task<Evento> CreateAsync(Evento evento);
    Task UpdateAsync(string id, Evento evento);
    Task DeleteAsync(string id);
}
