import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 500,        // 500 peticiones
      timeUnit: '1s',   // por segundo
      duration: '30s',  // durante 30 segundos
      preAllocatedVUs: 100, 
      maxVUs: 1000,
    },
  },
};

export default function () {
  const url = 'http://host.docker.internal:5000/api/v1/auth/login';
  
  const payload = JSON.stringify({
    email: 'admin@lenios.com',
    password: 'wrongpassword',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);
  
  check(res, {
    'rate limit excedido (429)': (r) => r.status === 429,
  });
}
