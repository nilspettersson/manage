import { Init } from './commands/init';
import { Public } from './commands/public';
import { Start } from './commands/start';
import { Stop } from './commands/stop';
import { Manage } from './manage';

export function cli() {
    let manage = new Manage();
    manage.add(new Init());
    manage.add(new Start());
    manage.add(new Stop());
    manage.add(new Public());
    manage.start();

}