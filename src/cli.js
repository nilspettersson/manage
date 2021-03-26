import { Init } from './commands/init';
import { Manage } from './manage';

export function cli() {

    let manage = new Manage();
    manage.add(new Init());
    manage.start();
    
}