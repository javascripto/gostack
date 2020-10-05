import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { year, month } = request.body;
    const { provider_id } = request.params;
    const listProviderMonthAvailability = container.resolve(ListProviderMonthAvailabilityService);
    const providerMonthAvailability = await listProviderMonthAvailability
      .execute({
        year,
        month,
        provider_id,
      });
    return response.json(providerMonthAvailability);
  }
}

export default ProviderMonthAvailabilityController;
