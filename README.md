# VC1 Project 3

### Description

All slide sets or scripts of the computer science studies up to the 4th semester were analyzed (and a few slides of the 5th semester). Furthermore, an embedding vector was created for each page/slide. This vector represents the semantic meaning.
Since this vector has a dimension of 1536, TSNE (T-distributed Stochastic Neighbor Embedding) was used to reduce the dimension to 2 to represent it graphically.

To explore the dataset, you can choose between the views Courses, Documents and Pages. Using the tooltip, you can see additional information about this data point.

### Disclaimer

No guarantee of correctness or completeness of the data. In addition, a reduction of the dimensions using TSNE does not guarantee a correct representation of the relationships. Since the original dimension was much larger than 2, data points may overlap that have nothing to do with each other. Please don't try to learn from this horrible code. It had to be done quickly.

### Usage of `dataPreprocessing.ipynb`

Install all Python dependencies:

```bash
pip install -r requirements.txt
```

You need a vector Database where you stored your data. To fill the database use the code of this [Repository](https://github.com/lukzimmermann/TextEmbedder).

Run all Elements and be Happy
