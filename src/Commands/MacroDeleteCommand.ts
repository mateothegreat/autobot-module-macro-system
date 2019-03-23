import { Command, CommandBase, CommandParser, DB, Event } from '@autobot/common';
import { RichEmbed }                                      from 'discord.js';
import { Macro }                                          from '../DB/Macro';

/**
 * Deletes a macro. Usage: ++delete name=docker
 */
@Command
export class MacroDeleteCommand extends CommandBase {

    public constructor() {

        //
        // Set this commands configuration.
        //
        super({

            event: Event.MESSAGE,
            name: '++delete',
            group: 'macros',
            description: 'Deletes a macro. Usage: ++delete name=docker',
            roles: [ 'admin' ],
            params: [

                {
                    name: 'name',
                    required: true

                }

            ]

        });

    }

    /**
     * Called when a command matches config.name.
     *
     * @param command Parsed out commamd
     *
     */
    public async run(command: CommandParser) {

        const deleted = await DB.connection.createQueryBuilder().delete().from(Macro).where('name = :name', { name: command.arguments[ 0 ].value }).execute();

        if (deleted.raw.affectedRows > 0) {

            command.obj.reply(new RichEmbed().setTitle('Delete Macro').setDescription(`The macro \`++${ command.arguments[ 0 ].value }\` has been deleted!`));

        } else {

            command.obj.reply(new RichEmbed().setTitle('Delete Macro').setDescription(`The macro \`++${ command.arguments[ 0 ].value }\` could not be deleted! Does it exist?`));

        }

    }

}
