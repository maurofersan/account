import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Account,
  Currency,
  AccountSelectionRequest,
  AccountSelectionResponse,
  RedisCreateRequest,
  RedisCreateResponse,
} from '../../shared/interfaces/account.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AccountApiService {
  private readonly baseUrl = '/api/account';

  constructor(private http: HttpClient) {}

  /**
   * Gets available accounts for the user
   */
  getAvailableAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/available`);
  }

  /**
   * Gets available currencies
   */
  getAvailableCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.baseUrl}/currencies`);
  }

  /**
   * Selects an account with specific currency
   */
  selectAccount(
    request: AccountSelectionRequest
  ): Observable<AccountSelectionResponse> {
    return this.http.post<AccountSelectionResponse>(
      `${this.baseUrl}/select`,
      request
    );
  }

  /**
   * Gets account details by ID
   */
  getAccountDetails(accountId: string): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/details/${accountId}`);
  }

  /**
   * Validates account selection
   */
  validateAccountSelection(
    accountId: string,
    currency: Currency
  ): Observable<{
    isValid: boolean;
    message?: string;
  }> {
    return this.http.post<{
      isValid: boolean;
      message?: string;
    }>(`${this.baseUrl}/validate`, { accountId, currency });
  }

  /**
   * Creates account in Redis
   */
  createRedisAccount(
    request: RedisCreateRequest
  ): Observable<RedisCreateResponse> {
    return this.http.post<RedisCreateResponse>(
      '/redis/create',
      request
    );
  }
}
