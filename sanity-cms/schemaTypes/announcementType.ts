import { defineField, defineType } from 'sanity'

export const announcementType = defineType({
    name: 'announcement',
    title: 'Announcement',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            title: 'Title',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'pdf',
            type: 'file',
            title: 'PDF File',
            options: {
                accept: '.pdf',
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'imagePreview',
            type: 'image',
            title: 'Image Preview',
            options: {
                hotspot: true,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            type: 'array',
            title: 'Description',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'link',
            type: 'url',
            title: 'Link',
            description: 'Optional link for the announcement',
        }),
        defineField({
            name: 'linkTitle',
            type: 'string',
            title: 'Link Title',
            description: 'Optional custom title for the link button',
        }),
        defineField({
            name: 'order',
            type: 'number',
            title: 'Order',
            description: 'Optional: Use to control the display order of announcements',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'description',
        },
    },
})

