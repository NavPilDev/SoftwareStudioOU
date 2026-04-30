import { defineField, defineType } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Team Member Names',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'position',
      type: 'string',
      title: 'Position/Role',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      type: 'string',
      title: 'Tagline',
      description: 'e.g., "Just Do It", "Think Different"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Project Image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'profilePicture',
      type: 'image',
      title: 'Profile Picture',
      description: 'Profile picture for the team member/creator',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'year',
      type: 'number',
      title: 'Year',
      description: 'The year this project was created (e.g., 2026)',
      validation: (rule) => rule.required().min(2020).max(2099),
    }),
    defineField({
      name: 'batch',
      type: 'string',
      title: 'Batch',
      description: 'Which Software Studio batch this project belongs to',
      options: {
        list: [
          { title: 'Spring', value: 'Spring' },
          { title: 'Fall', value: 'Fall' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Order',
      description: 'Optional: Use to control the display order of projects',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'name',
      media: 'image',
    },
  },
})
