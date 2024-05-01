from fastapi import APIRouter
import numpy as np

router = APIRouter()


@router.get('/matrix')
def generate_matrices():
    matrix_a = np.random.rand(10, 10)
    matrix_b = np.random.rand(10, 10)
    product = np.dot(matrix_a, matrix_b)

    return {
        'matrix_a': matrix_a.tolist(),
        'matrix_b': matrix_b.tolist(),
        'product': product.tolist()
    }
