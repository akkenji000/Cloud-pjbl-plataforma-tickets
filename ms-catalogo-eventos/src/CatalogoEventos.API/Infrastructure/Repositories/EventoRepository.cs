using MongoDB.Driver;
using CatalogoEventos.API.Domain.Entities;
using CatalogoEventos.API.Domain.Interfaces;
using CatalogoEventos.API.Infrastructure.Persistence;

namespace CatalogoEventos.API.Infrastructure.Repositories;

public class EventoRepository(MongoDbContext context) : IEventoRepository
{
    public async Task<List<Evento>> GetAllAsync() =>
        await context.Eventos.Find(_ => true).ToListAsync();

    public async Task<Evento?> GetByIdAsync(string id) =>
        await context.Eventos.Find(e => e.Id == id).FirstOrDefaultAsync();

    public async Task<Evento> CreateAsync(Evento evento)
    {
        await context.Eventos.InsertOneAsync(evento);
        return evento;
    }

    public async Task UpdateAsync(string id, Evento evento) =>
        await context.Eventos.ReplaceOneAsync(e => e.Id == id, evento);

    public async Task DeleteAsync(string id) =>
        await context.Eventos.DeleteOneAsync(e => e.Id == id);
}
