FROM mcr.microsoft.com/azure-functions/dotnet-isolated:4-dotnet-isolated8.0 AS base
WORKDIR /home/site/wwwroot
EXPOSE 7071

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["TaxasFunction/TaxasFunction.csproj", "TaxasFunction/"]
RUN dotnet restore "TaxasFunction/TaxasFunction.csproj"
COPY . .
WORKDIR "/src/TaxasFunction"
RUN dotnet build "TaxasFunction.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TaxasFunction.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /home/site/wwwroot
COPY --from=publish /app/publish .
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true
