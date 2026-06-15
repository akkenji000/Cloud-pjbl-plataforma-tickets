using MongoDB.Driver;
using CatalogoEventos.API.Domain.Entities;

namespace CatalogoEventos.API.Infrastructure.Persistence;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IConfiguration configuration)
    {
        var connStr = configuration["MongoDB:ConnectionString"]
            ?? "mongodb://admin:admin_password_123@localhost:27017";
        var dbName = configuration["MongoDB:DatabaseName"] ?? "catalogo_eventos";
        _database = new MongoClient(connStr).GetDatabase(dbName);
    }

    public IMongoCollection<Evento> Eventos => _database.GetCollection<Evento>("eventos");
}
