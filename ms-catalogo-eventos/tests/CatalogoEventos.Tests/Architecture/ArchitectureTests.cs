using NetArchTest.Rules;

namespace CatalogoEventos.Tests.Architecture;

public class ArchitectureTests
{
    [Fact]
    public void Domain_ShouldNot_DependOn_Infrastructure()
    {
        var result = Types
            .InAssembly(typeof(CatalogoEventos.API.Domain.Entities.Evento).Assembly)
            .That().ResideInNamespace("CatalogoEventos.API.Domain")
            .ShouldNot().HaveDependencyOn("CatalogoEventos.API.Infrastructure")
            .GetResult();

        Assert.True(result.IsSuccessful);
    }
}
