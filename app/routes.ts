import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home/index.tsx'),
  route('rent', './routes/rent/index.tsx'),
  route('groceries', './routes/groceries/index.tsx'),
  route('warranty', './routes/warranty/index.tsx'),
  route('subscription', './routes/subscription/index.tsx'),
] satisfies RouteConfig;
