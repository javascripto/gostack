import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { year, month } = request.query;
    const { provider_id } = request.params;
    const listProviderMonthAvailability = container.resolve(ListProviderMonthAvailabilityService);
    const providerMonthAvailability = await listProviderMonthAvailability
      .execute({
        provider_id,
        year: Number(year),
        month: Number(month),
      });
    return response.json(providerMonthAvailability);
  }
}

export default ProviderMonthAvailabilityController;
