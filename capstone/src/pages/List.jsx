import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./List.css";
import PrimaryButton from "../components/PrimaryButton";
import Modal from "../components/Modal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

// 이미지 import
import appleImage from "../assets/apple.png";
import potatoImage from "../assets/potato.png";
import mandarineImage from "../assets/mandarine.png";
import oreoImage from "../assets/oreo.png";

// 상품 이미지 매핑
const productImages = {
  apple: appleImage,
  potato: potatoImage,
  mandarine: mandarineImage,
  oreo: oreoImage,
};

// Django 서버와의 통신을 위한 API 함수들
const api = {
  // 장바구니 목록 가져오기
  getCartItems: async () => {
    const response = await fetch("http://localhost:8000/api/cart/", {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch cart items");
    return response.json();
  },

  // 장바구니에 상품 추가
  addToCart: async (productId, quantity) => {
    const response = await fetch("http://localhost:8000/api/cart/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    if (!response.ok) throw new Error("Failed to add item to cart");
    return response.json();
  },

  // 장바구니에서 상품 제거
  removeFromCart: async (productId) => {
    const response = await fetch(
      `http://localhost:8000/api/cart/remove/${productId}/`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "상품 삭제에 실패했습니다");
    }
    return response.json();
  },

  // 장바구니 상품 수량 업데이트
  updateCartItem: async (productId, quantity) => {
    const response = await fetch(
      `http://localhost:8000/api/cart/update/${productId}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      }
    );
    if (!response.ok) throw new Error("Failed to update cart item");
    return response.json();
  },
};

// Mock 데이터 (Django 연동 시 제거)
/*
const mockProducts = [
  {
    id: 1,
    name: "apple",
    weight: "500g",
    price: 10000,
    image: appleImage,
    category: "fruit",
  },
  {
    id: 2,
    name: "potato",
    weight: "450g",
    price: 5000,
    image: potatoImage,
    category: "vegetable",
  },
  {
    id: 3,
    name: "mandarine",
    weight: "350g",
    price: 3000,
    image: mandarineImage,
    category: "fruit",
  },
  {
    id: 4,
    name: "oreo",
    quantity: "1개",
    price: 2000,
    image: oreoImage,
    category: "snack",
  },
];
*/

const styles = {
  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
  },
  quantityButton: {
    padding: "4px 8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    background: "white",
    cursor: "pointer",
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    "&:hover:not(:disabled)": {
      background: "#f5f5f5",
    },
  },
  removeButton: {
    marginTop: "8px",
    padding: "4px 12px",
    border: "1px solid #ff4d4f",
    borderRadius: "4px",
    background: "white",
    color: "#ff4d4f",
    cursor: "pointer",
    "&:hover": {
      background: "#fff1f0",
    },
  },
  productDetails: {
    fontSize: "16px",
    color: "#666",
    margin: "4px 0",
  },
};

const ProductCard = ({ product, onRemove }) => {
  // 상품 이름에 따라 이미지 선택
  const productImage = productImages[product.name.toLowerCase()] || null;

  return (
    <div className="product-card">
      <div className="product-image-container">
        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            className="product-image"
          />
        ) : (
          <div className="no-image">이미지 없음</div>
        )}
      </div>
      <div className="product-info">
        <h2 className="product-name">{product.name}</h2>
        <div className="product-details">
          {product.category === "snack" ? (
            <p style={styles.productDetails}>수량: {product.quantity}개</p>
          ) : (
            <p style={styles.productDetails}>무게: {product.weight}kg</p>
          )}
          <p className="product-price">{product.price.toLocaleString()}원</p>
          <button
            style={styles.removeButton}
            onClick={() => onRemove(product.id)}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  // 장바구니 목록 가져오기 함수를 useCallback으로 메모이제이션
  const fetchCartItems = useCallback(async () => {
    try {
      const data = await api.getCartItems();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 데이터 로딩
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // 주기적으로 데이터 업데이트 (3초마다)
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchCartItems();
    }, 3000);

    // 컴포넌트가 언마운트되면 인터벌 정리
    return () => clearInterval(intervalId);
  }, [fetchCartItems]);

  // 상품 제거 처리
  const handleRemoveItem = async (productId) => {
    try {
      await api.removeFromCart(productId);
      await fetchCartItems(); // 목록 새로고침
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleCheckout = () => {
    if (products.length === 0) {
      setShowModal(true);
    } else {
      navigate("/pay");
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await handleRemoveItem(productToDelete.id);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Mock 데이터 로드 (Django 연동 시 제거)
  /*
  useEffect(() => {
    setProducts(mockProducts);
  }, []);
  */

  // 로딩 상태 처리
  if (loading && products.length === 0) return <div>Loading...</div>;
  // 에러 상태 처리
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="list-container">
      <div className="list-wrapper">
        <div className="list-header">
          <div className="list-title-container">
            <h1 className="list-title">상품 목록</h1>
            <span className="total-price">
              총액:{" "}
              {products
                .reduce((sum, product) => sum + product.price, 0)
                .toLocaleString()}
              원
            </span>
          </div>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onRemove={() => handleDeleteClick(product)}
            />
          ))}
        </div>
        <PrimaryButton className="checkout-button" onClick={handleCheckout}>
          결제하기
        </PrimaryButton>
      </div>

      {/* 장바구니 비어있음 모달 */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="알림"
      >
        <p>장바구니가 비어있습니다!</p>
      </Modal>

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name}
      />
    </main>
  );
};

export default List;
