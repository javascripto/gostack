import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { day, year, month } = request.query;
    const { provider_id } = request.params;
    const listProviderDayAvailability = container.resolve(ListProviderDayAvailabilityService);
    const providerMonthAvailability = await listProviderDayAvailability
      .execute({
        provider_id,
        day: Number(day),
        year: Number(year),
        month: Number(month),
      });
    return response.json(providerMonthAvailability);
  }
}

export default ProviderDayAvailabilityController;
