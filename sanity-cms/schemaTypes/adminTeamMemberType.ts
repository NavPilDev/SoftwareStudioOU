import { defineField, defineType } from 'sanity'

export const adminTeamMemberType = defineType({
    name: 'adminTeamMember',
    title: 'Admin Team Member',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            type: 'string',
            title: 'Name',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'role',
            type: 'string',
            title: 'Role',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            type: 'text',
            title: 'Description',
            rows: 4,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'profilePicture',
            type: 'image',
            title: 'Profile Picture',
            options: {
                hotspot: true,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'order',
            type: 'number',
            title: 'Order',
            description: 'Optional: Use to control the display order of admin team members',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'role',
            media: 'profilePicture',
        },
    },
})

