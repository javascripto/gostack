import { Request, Response } from 'express';

class IndexController {
  index(request: Request, response: Response) {
    return response.json({ message: 'Hello World'})
  }
}
export default new IndexController();
