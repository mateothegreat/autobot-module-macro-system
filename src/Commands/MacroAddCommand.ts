import { Command, CommandBase, CommandParser, DB, Event } from '@autobot/common';
import { RichEmbed }                                      from 'discord.js';
import { Macro }                                          from '../DB/Macro';

/**
 * Adds a new macro.Ex: ++add name=test message=this is a test macro
 */
@Command
export class MacroAddCommand extends CommandBase {

    public constructor() {

        //
        // Set this commands configuration.
        //
        super({

            event: Event.MESSAGE,
            name: '++add',
            group: 'macros',
            description: 'Create or replace a new macro. Usage: ++add name=docker,message=Check out https://docker.io!',
            roles: [ 'admin' ],
            params: [

                {
                    name: 'name',
                    required: true

                }, {

                    name: 'message',
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

        //
        // First we try to retrieve the macro by name.
        //
        const result = await DB.connection.getRepository(Macro)
                               .createQueryBuilder('Macro')
                               .select([ '*' ])
                               .where('name = :name', { name: command.namedarguments.name })
                               .getRawOne();

        //
        // Macro exists, so let's update it else we create a new one.
        //
        if (result) {

            result.name = command.namedarguments.name;
            result.message = command.namedarguments.message;

            DB.connection
              .createQueryBuilder()
              .update(Macro)
              .set(result)
              .where('id = :id', { id: result.id })
              .execute();

            command.obj.reply(new RichEmbed().setTitle('Update Macro').setDescription(`The macro \`++${ command.namedarguments.name }\` has been updated!`));

        } else {

            const macro: Macro = new Macro();

            macro.name = command.namedarguments.name;
            macro.message = command.namedarguments.message;

            DB.connection.manager.save(macro);

            command.obj.reply(new RichEmbed().setTitle('Create Macro').setDescription(`The macro \`++${ command.namedarguments.name }\` has been created!`));

        }

    }

}
