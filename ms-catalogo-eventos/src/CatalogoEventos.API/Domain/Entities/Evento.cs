using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CatalogoEventos.API.Domain.Entities;

public class Evento
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public DateTime Data { get; set; }
    public string Local { get; set; } = string.Empty;
    public int Capacidade { get; set; }
    public decimal PrecoBase { get; set; }
    public string Categoria { get; set; } = string.Empty;
    public string Status { get; set; } = "Ativo";
}
