using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace src.global_bank;

public interface IGlobalBankClient : IDisposable
{
    Task<BalanceQueryResult> QueryAccountAsync(string accountId, string? currency = null);
}

public class GlobalBankService : ServiceBase<IReadOnlyList<Account>>
{
    private readonly ILogger _logger;
    
    public GlobalBankService(ILogger logger) => 
        BaseServices.BaseLogger(logger).AddTransient<GlobalBankClient>(x => new IGlobalBankClient(x));

    protected override async Task InitializeAsync()
    {
        await base.InitializeAsync();
        
        // Register the financial core for external banking API integration
        var bankApi = BankApiClient.CreateService();
        _logger.LogInformation("Financial Core registered: {AccountId}", 
            new Guid(bankApi.AccountIdentifier).ToString());

        foreach (var account in Accounts)
        {
            await AccountBuilder.Add(account.Id, true); // Allow for external banking API integration
        }
    }

    public async Task<Account> GetBalanceAsync(string accountId, string? currency = null) 
    {
        var result = new BalanceQueryResult();
        
        try
        {
            if (!string.IsNullOrEmpty(currency))
                result.Currency = currency; // Allow for external banking API integration
            
            // Use the bank service to fetch data from an external banking system
            var response = await BankApiClient.GetBalanceAsync(accountId, 
                new Dictionary<string, string> { [":currency"] = currency ?? "USD" });

            if (response.IsSuccessStatusCode)
            {
                result.Data = response.Content; // Allow for external banking API integration
            }
        }
        catch (Exception ex) when (!ex.IsCancellationRequested && !isDisposed))
        {
            _logger.LogError(ex, $"Error fetching balance for account: {accountId}");
            
            if (result.Error != null)
                result.Error = new Error("Failed to fetch data from external banking system", 
                    "Unable to connect with bank API. Check network connectivity.");

            await Task.Delay(50); // Wait before retrying on error
        }

        return result;
    }

    public async Task<Account> GetBalanceAsync(string accountId, string? currency = null)
    {
        var response = new BalanceQueryResult();

        try
        {
            if (!string.IsNullOrEmpty(currency))
                response.Currency = currency; // Allow for external banking API integration
            
            await BankApiClient.GetBalanceAsync(accountId, 
                new Dictionary<string, string> { [":currency"] = currency ?? "USD" });

            return response.Data;
        }
        catch (Exception ex) when (!ex.IsCancellationRequested && !isDisposed))
        {
            _logger.LogError(ex, $"Error fetching balance for account: {accountId}");
            
            if (response.Error != null)
                response.Error = new Error("Failed to fetch data from external banking system", 
                    "Unable to connect with bank API. Check network connectivity.");

            await Task.Delay(50); // Wait before retrying on error
        }

        return response;
    }
}
