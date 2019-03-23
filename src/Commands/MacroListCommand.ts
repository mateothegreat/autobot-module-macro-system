import { Command, CommandBase, CommandParser, DB, Event } from '@autobot/common';
import { RichEmbed }                                      from 'discord.js';
import { Macro }                                          from '../DB/Macro';

/**
 * Display all saved macros. Usage: ++list
 */
@Command
export class MacroListCommand extends CommandBase {

    public constructor() {

        //
        // Set this commands configuration.
        //
        super({

            event: Event.MESSAGE,
            name: '++list',
            group: 'macros',
            description: 'Display all saved macros. Usage: ++list',
            roles: [ 'admin' ]

        });

    }

    /**
     * Called when a command matches config.name.
     *
     * @param command Parsed out commamd
     *
     */
    public async run(command: CommandParser) {

        const results = await DB.connection.getRepository(Macro)
                                .createQueryBuilder('Macro')
                                .select([ '*' ])
                                .orderBy('name')
                                .getRawMany();

        const embed = new RichEmbed().setTitle('Available Macros');

        for (let i = 0; i < results.length; i++) {

            embed.addField(results[ i ].name, results[ i ].message);

        }

        command.obj.reply(embed);

    }

}
