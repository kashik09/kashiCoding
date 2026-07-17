export interface FAQItem {
  question: string
  answer: string
}

export interface AccordionFAQProps {
  items: FAQItem[]
}

export function AccordionFAQ({ items }: AccordionFAQProps) {
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="collapse collapse-plus bg-base-200">
          <input type="radio" name="faq-accordion" defaultChecked={idx === 0} />
          <div className="collapse-title text-xl font-medium">{item.question}</div>
          <div className="collapse-content">
            <p className="text-base-content/80">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
