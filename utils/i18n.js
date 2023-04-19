// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateTitle(title, query, viceTitle) {
  console.log(title)
  console.log(query)
  console.log(viceTitle)

  if (title) {
    if (query.editId && viceTitle) {
      return viceTitle
    } else {
      return title
    }
  }
  return title
  // const hasKey = title

  // if (hasKey) {
  //   const translatedTitle = title

  //   return translatedTitle
  // }
  // return title
}
