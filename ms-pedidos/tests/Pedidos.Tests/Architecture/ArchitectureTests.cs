using NetArchTest.Rules;

namespace Pedidos.Tests.Architecture;

public class ArchitectureTests
{
    [Fact]
    public void Domain_ShouldNot_DependOn_Infrastructure()
    {
        var result = Types
            .InAssembly(typeof(Pedidos.API.Domain.Entities.Pedido).Assembly)
            .That().ResideInNamespace("Pedidos.API.Domain")
            .ShouldNot().HaveDependencyOn("Pedidos.API.Infrastructure")
            .GetResult();

        Assert.True(result.IsSuccessful);
    }
}
