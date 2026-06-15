using Microsoft.EntityFrameworkCore;
using Pedidos.API.Domain.Entities;

namespace Pedidos.API.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Pedido> Pedidos => Set<Pedido>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ClienteNome).HasMaxLength(200).IsRequired();
            entity.Property(e => e.ClienteEmail).HasMaxLength(200).IsRequired();
            entity.Property(e => e.ValorTotal).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).HasMaxLength(50);
        });
    }
}
