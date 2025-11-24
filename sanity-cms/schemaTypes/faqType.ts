import {defineField, defineType} from 'sanity'

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      title: 'Question',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      type: 'text',
      title: 'Answer',
      rows: 4, // This makes it a textarea with 4 rows
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Order',
      description: 'Optional: Use to control the display order of FAQs',
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'answer',
    },
  },
})

