import Category from './category.model.js'


export const add = async (req, res) => {
    try {
        let data = req.body
        let existingCategory = await Category.findOne({ name: data.name });
        if (existingCategory) {
            return res.status(400).send({ message: 'There is already a category with this name' });
        }
        if (!data.name || !data.description) return res.status(400).send({ message: 'All the parameters must be filled' })
        let category = new Category(data)
        await category.save()
        return res.send({ message: 'The category was created' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Umm something was wrong' })
    }
}