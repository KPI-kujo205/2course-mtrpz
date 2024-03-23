import { main } from './src';

try {
  main();
} catch (e) {
  console.error(e);
  process.exit(1);
}
