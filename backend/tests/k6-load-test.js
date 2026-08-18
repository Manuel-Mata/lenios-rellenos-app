import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 }, // Rampa de subida a 100 usuarios en 30s
    { duration: '1m', target: 100 },  // Mantener 100 usuarios por 1 minuto
    { duration: '30s', target: 0 },   // Rampa de bajada a 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% de las peticiones deben ser menores a 200ms
    http_req_failed: ['rate<0.01'],   // Tasa de fallo menor al 1%
  },
};

export default function () {
  const url = 'http://host.docker.internal:5000/api/v1/productos'; // Asumiendo puerto 5000 y usando host.docker.internal para alcanzar el localhost del host

  const res = http.get(url);

  check(res, {
    'estado es 200': (r) => r.status === 200,
    'respuesta rápida': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
