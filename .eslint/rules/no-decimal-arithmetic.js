module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow direct arithmetic operations on Decimal-type fields',
      category: 'Possible Errors',
      recommended: true,
    },
    messages: {
      decimalArithmetic: 'Direct arithmetic on Decimal fields. Use Decimal helpers or toNumber() first.',
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode()
    const operators = ['+', '-', '*', '/', '%']
    const decimalPattern = /\.(price|usdPrice|ugxPrice|total|subtotal|tax)\b/

    return {
      BinaryExpression(node) {
        if (!operators.includes(node.operator)) return

        const leftText = sourceCode.getText(node.left)
        const rightText = sourceCode.getText(node.right)

        if (decimalPattern.test(leftText) || decimalPattern.test(rightText)) {
          context.report({
            node,
            messageId: 'decimalArithmetic',
          })
        }
      },
    }
  },
}
